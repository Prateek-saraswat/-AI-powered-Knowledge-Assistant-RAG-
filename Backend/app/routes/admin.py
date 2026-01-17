from typing import Any
from flask import Blueprint, jsonify, request
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

from app.middlewares.auth_middleware import jwt_required
import app.extensions as extensions
from app.utils.serializer import serialize_dict

admin_bp = Blueprint("admin", __name__)








@admin_bp.route("/users", methods=["GET"])
@jwt_required(role="admin")
def get_all_users():
    

    try:
       
        users = list(
            extensions.db.users.aggregate([
                {
                    "$lookup": {
                        "from": "documents",
                        "localField": "_id",
                        "foreignField": "userId",
                        "as": "documents"
                    }
                },
                {
                    "$lookup": {
                        "from": "chat_messages",
                        "localField": "_id",
                        "foreignField": "userId",
                        "as": "queries"
                    }
                },
                {
                    "$project": {
                        "_id": 1,
                        "email": 1,
                        "role": {"$ifNull": ["$role", "user"]},
                        "createdAt": 1,
                        "lastLogin": 1,
                        "documentCount": {"$size": "$documents"},
                        "queryCount": {"$size": "$queries"}
                    }
                },
                {"$sort": {"createdAt": -1}}
            ])
        )

      
        users = [serialize_dict(user) for user in users]
        

        return jsonify({
            "success": True,
            "users": users,
            "count": len(users)
        }), 200

    except Exception as e:
        print(f"Error in get_all_users: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch users"}), 500

@admin_bp.route("/users/<user_id>/documents", methods=["GET"])
@jwt_required(role="admin")
def get_user_documents(user_id):
    

    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({"error": "Invalid user ID"}), 400

        user_object_id = ObjectId(user_id)

        user = extensions.db.users.find_one({"_id": user_object_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        documents = list(
            extensions.db.documents.find(
                {"userId": user_object_id}
            ).sort("createdAt", -1)
        )

        serialized_docs = [serialize_dict(doc) for doc in documents]

        return jsonify({
            "success": True,
            "userEmail": user.get('email'),
            "documents": serialized_docs,
            "count": len(serialized_docs)
        }), 200

    except Exception as e:
        print(f"Error in get_user_documents: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch user documents"}), 500

@admin_bp.route("/users/<user_id>/queries", methods=["GET"])
@jwt_required(role="admin")
def get_user_queries(user_id):
    

    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({"error": "Invalid user ID"}), 400

        user_object_id = ObjectId(user_id)

        user = extensions.db.users.find_one({"_id": user_object_id})
        if not user:
            return jsonify({"error": "User not found"}), 404

        queries = list(
            extensions.db.chat_messages.find(
                {"userId": user_object_id}
            ).sort("createdAt", -1).limit(100)
        )

        serialized_queries = [serialize_dict(q) for q in queries]
       

        return jsonify({
            "success": True,
            "userEmail": user.get('email'),
            "queries": serialized_queries,
            "count": len(serialized_queries)
        }), 200

    except Exception as e:
        print(f"Error in get_user_queries: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch user queries"}), 500

@admin_bp.route("/documents", methods=["GET"])
@jwt_required(role="admin")
def get_all_documents():
    

    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 20))
        skip = (page - 1) * limit
        documents = list(
            extensions.db.documents.aggregate([
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "userId",
                        "foreignField": "_id",
                        "as": "user"
                    }
                },
                {"$unwind": "$user"},
                {
                    "$project": {
                        "_id": 1,
                        "filename": 1,
                        "enabled": {"$ifNull": ["$enabled", True]},
                        "status": {"$ifNull": ["$status", "processed"]},
                        "size": 1,
                        "createdAt": 1,
                        "userEmail": "$user.email",
                        "userId": 1
                    }
                },
                {"$sort": {"createdAt": -1}},
                {"$skip": skip},
                {"$limit": limit}
            ])
        )

        documents = [serialize_dict(doc) for doc in documents]
        total_docs = extensions.db.documents.count_documents({})
       

        return jsonify({
            "success": True,
            "documents": documents,
            "pagination": {
        "page": page,
        "limit": limit,
        "total": total_docs
    }
        }), 200

    except Exception as e:
        print(f"Error in get_all_documents: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch documents"}), 500



@admin_bp.route("/documents/<doc_id>/toggle", methods=["PATCH"])
@jwt_required(role="admin")
def toggle_document(doc_id):
    

    try:
        document_object_id = ObjectId(doc_id)
    except InvalidId:
        return jsonify({"error": "Invalid document ID"}), 400

    doc = extensions.db.documents.find_one({"_id": document_object_id})
    if not doc:
        return jsonify({"error": "Document not found"}), 404

    new_status = not doc.get("enabled", True)

    extensions.db.documents.update_one(
        {"_id": document_object_id},
        {"$set": {"enabled": new_status}}
    )

    return jsonify({
        "success": True,
        "documentId": doc_id,
        "enabled": new_status
    }), 200


@admin_bp.route("/queries", methods=["GET"])
@jwt_required(role="admin")
def view_queries():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    skip = (page - 1) * limit

    try:
        queries = list(
            extensions.db.chat_messages.aggregate([
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "userId",
                        "foreignField": "_id",
                        "as": "user"
                    }
                },
                {"$unwind": "$user"},
                {
                    "$project": {
                        "_id": 1,
                        "question": 1,
                        "answer": 1,
                        "createdAt": 1,
                        "userEmail": "$user.email",
                        "userId": 1
                    }
                },
                {"$sort": {"createdAt": -1}},
                {"$skip": skip},
                {"$limit": limit}
                ])
        )

        queries = [serialize_dict(q) for q in queries]
        total_queries = extensions.db.chat_messages.count_documents({})
        

        return jsonify({
            "success": True,
            "queries": queries,
            "pagination": {
            "page": page,
            "limit": limit,
            "total": total_queries
            }
        }), 200

    except Exception as e:
        print(f"Error in view_queries: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch queries"}), 500


@admin_bp.route("/usage", methods=["GET"])
@jwt_required(role="admin")
def usage_stats():
    

    try:
        usage = list(
            extensions.db.usage_logs.aggregate([
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "userId",
                        "foreignField": "_id",
                        "as": "user"
                    }
                },
                {"$unwind": "$user"},
                {
                    "$group": {
                        "_id": "$user.email",
                        "userId": {"$first": "$user._id"},
                        "tokens": {"$sum": "$tokens"}
                    }
                },
                {"$sort": {"tokens": -1}}
            ])
        )

        formatted_usage = [serialize_dict(u) for u in usage]
        

        return jsonify({
            "success": True,
            "usage": formatted_usage,
            "count": len(formatted_usage)
        }), 200

    except Exception as e:
        print(f"Error in usage_stats: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch usage stats"}), 500

@admin_bp.route("/stats", methods=["GET"])
@jwt_required(role="admin")
def dashboard_stats():
    

    try:
        total_users = extensions.db.users.count_documents({})
        
        total_documents = extensions.db.documents.count_documents({})
        
        active_documents = extensions.db.documents.count_documents({"enabled": True})
        
        total_queries = extensions.db.chat_messages.count_documents({})
        
        from datetime import datetime, timedelta
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        queries_today = extensions.db.chat_messages.count_documents({
            "createdAt": {"$gte": today_start}
        })
        
        total_tokens_result = list(extensions.db.usage_logs.aggregate([
            {"$group": {"_id": None, "total": {"$sum": "$tokens"}}}
        ]))
        total_tokens = total_tokens_result[0]["total"] if total_tokens_result else 0

        return jsonify({
            "success": True,
            "stats": {
                "totalUsers": total_users,
                "totalDocuments": total_documents,
                "activeDocuments": active_documents,
                "totalQueries": total_queries,
                "queriesToday": queries_today,
                "totalTokens": total_tokens
            }
        }), 200

    except Exception as e:
        print(f"Error in dashboard_stats: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch dashboard stats"}), 500