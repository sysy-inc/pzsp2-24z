import json

from src.backend.models import Platform, MeasurementType, Measurement, Sensor
from sqlalchemy import select
from src.backend.db_controller import async_session

from datetime import datetime


async def fetch_test_data():
    async with async_session() as session:
        query = select(Sensor)
        result = await session.execute(query)
        measurements = result.scalars().all()
        return measurements


async def fetch_latest_measurement():
    # Fetch the latest measurement from sensor 1 and the latest from sensor 2.
    async with async_session() as session:
        query_sensor1 = (
            select(Measurement)
            .where(Measurement.sensor_id == 1)
            .order_by(Measurement.date.desc())
            .limit(1)
        )
        query_sensor2 = (
            select(Measurement)
            .where(Measurement.sensor_id == 2)
            .order_by(Measurement.date.desc())
            .limit(1)
        )

        result_sensor1 = await session.execute(query_sensor1)
        result_sensor2 = await session.execute(query_sensor2)

        latest_measurement_sensor1 = result_sensor1.scalars().first()
        latest_measurement_sensor2 = result_sensor2.scalars().first()

        return {
            "sensor_1": latest_measurement_sensor1,
            "sensor_2": latest_measurement_sensor2,
        }


def parse_message(message: str) -> dict:
    # The message is a json string, turn it into a dictionary
    try:
        message_dict = json.loads(message)
    except json.JSONDecodeError:
        print("Error parsing message")
        return {"error": "Invalid JSON format"}
    return message_dict


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
