import json
from pydantic import BaseModel, ValidationError
from functools import wraps
from typing import Generic, TypeVar, Type

Model = TypeVar("Model", bound=BaseModel)


class jsonToModel(Generic[Model]):
    """
    A marker type for JSON strings that will be converted to a Pydantic model.
    """

    pass


def validate_and_convert_arguments(model: Type[Model]):
    """
    A decorator to validate and convert a JSON string argument
    into a Pydantic model instance.
    :param model_class: The Pydantic model class to validate against.
    """

    def decorator(func):
        @wraps(func)
        def wrapper(argument, *args, **kwargs):
            try:
                data = json.loads(argument)

                model_instance = model(**data)

                return func(model_instance, *args, **kwargs)

            except json.JSONDecodeError as e:
                raise ValueError(f"Invalid JSON format: {e}")
            except ValidationError as e:
                raise ValueError(f"Validation error: {e}")

        return wrapper

    return decorator
