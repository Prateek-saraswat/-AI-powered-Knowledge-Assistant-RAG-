from bson import ObjectId


def serialize_object_id(value):
    if isinstance(value, ObjectId):
        return str(value)
    return value


def serialize_dict(data: dict):
    """
    Recursively converts ObjectId values inside dict to strings
    """
    serialized = {}

    for key, value in data.items():
        if isinstance(value, ObjectId):
            serialized[key] = str(value)
        elif isinstance(value, dict):
            serialized[key] = serialize_dict(value)
        elif isinstance(value, list):
            serialized[key] = [
                serialize_dict(item) if isinstance(item, dict) else serialize_object_id(item)
                for item in value
            ]
        else:
            serialized[key] = value

    return serialized
