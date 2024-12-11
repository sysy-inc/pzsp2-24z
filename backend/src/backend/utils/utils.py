import json


def parse_message(message: str) -> dict:
    """
    If a message string is a JSON, parse it into a dictionary
    """

    try:
        message_dict = json.loads(message)
    except json.JSONDecodeError:
        print("Error parsing message")
        return {"error": "Invalid JSON format"}
    return message_dict
