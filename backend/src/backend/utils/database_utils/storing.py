from datetime import datetime

from src.backend.utils.utils import parse_message
from src.backend.utils.database_utils.models import Measurement
from src.backend.utils.database_utils.db_controller import async_session


async def save_sample_to_db(message: str):
    """
    Parses a JSON string containing a single measurement and saves it to the database.

    :param message: JSON string containing a single measurement.
    """
    try:
        # Parse the JSON message
        message_dict = parse_message(message)

        # Validate the required fields
        sensor_id = message_dict.get("sensor_id")
        value = message_dict.get("value")

        if not (sensor_id and value):
            print(f"Invalid message format: {message}")
            return

        # Add the current date and time
        current_date = datetime.now()

        # Create the Measurement object
        measurement = Measurement(sensor_id=sensor_id, value=value, date=current_date)

        # Save the measurement to the database
        async with async_session() as session:
            async with session.begin():
                session.add(measurement)
                print(f"Successfully saved measurement: {measurement}")

    except Exception as e:
        print(f"Error saving sample to database: {e}")

    except Exception as e:
        print(f"Error saving samples to database: {e}")
    print("Inserting data into the database")
