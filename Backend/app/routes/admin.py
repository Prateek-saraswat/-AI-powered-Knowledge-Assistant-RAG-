from typing import Any
from flask import Blueprint, jsonify, request
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

from app.middlewares.auth_middleware import jwt_required
import app.extensions as extensions

admin_bp = Blueprint("admin", __name__)



def serialize_user(user):
    """Serialize user object for JSON"""
    return {
        '_id': str(user.get('_id')),
        'email': user.get('email'),
        'role': user.get('role', 'user'),
        'createdAt': user.get('createdAt').isoformat() if user.get('createdAt') else None,
        'lastLogin': user.get('lastLogin').isoformat() if user.get('lastLogin') else None
    }


def serialize_document(doc):
    """Serialize document object for JSON"""
    return {
        '_id': str(doc.get('_id')),
        'filename': doc.get('filename'),
        'enabled': doc.get('enabled', True),
        'status': doc.get('status', 'processed'),
        'size': doc.get('size'),
        'createdAt': doc.get('createdAt').isoformat() if doc.get('createdAt') else None,
        'userId': str(doc.get('userId'))
    }

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

      
        serialized_users = []
        for user in users:
            serialized_users.append({
                '_id': str(user.get('_id')),
                'email': user.get('email'),
                'role': user.get('role', 'user'),
                'createdAt': user.get('createdAt').isoformat() if user.get('createdAt') else None,
                'lastLogin': user.get('lastLogin').isoformat() if user.get('lastLogin') else None,
                'documentCount': user.get('documentCount', 0),
                'queryCount': user.get('queryCount', 0)
            })

        return jsonify({
            "success": True,
            "users": serialized_users,
            "count": len(serialized_users)
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

        serialized_docs = [serialize_document(doc) for doc in documents]

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

        serialized_queries = []
        for query in queries:
            serialized_queries.append({
                'id': str(query.get('_id')),
                'documentId': str(query.get('documentId')),
                'question': query.get('question'),
                'answer': query.get('answer'),
                'createdAt': query.get('createdAt').isoformat() if query.get('createdAt') else None
            })

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
                {"$limit": 200}
            ])
        )

        serialized_docs = []
        for doc in documents:
            serialized_docs.append({
                '_id': str(doc.get('_id')),
                'filename': doc.get('filename'),
                'enabled': doc.get('enabled', True),
                'status': doc.get('status', 'processed'),
                'size': doc.get('size'),
                'createdAt': doc.get('createdAt').isoformat() if doc.get('createdAt') else None,
                'userEmail': doc.get('userEmail'),
                'userId': str(doc.get('userId'))
            })

        return jsonify({
            "success": True,
            "documents": serialized_docs,
            "count": len(serialized_docs)
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
                {"$limit": 100}
            ])
        )

        serialized_queries = []
        for query in queries:
            serialized_queries.append({
                'id': str(query.get('_id')),
                'question': query.get('question'),
                'answer': query.get('answer'),
                'createdAt': query.get('createdAt').isoformat() if query.get('createdAt') else None,
                'userEmail': query.get('userEmail'),
                'userId': str(query.get('userId'))
            })

        return jsonify({
            "success": True,
            "queries": serialized_queries,
            "count": len(serialized_queries)
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

        formatted_usage = []
        for u in usage:
            formatted_usage.append({
                "userEmail": u["_id"],
                "userId": str(u.get("userId")),
                "tokens": u["tokens"]
            })

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