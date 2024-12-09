import json

from src.backend.models import Platform, MeasurementType, Measurement, Sensor
from sqlalchemy import select
from src.backend.db_controller import async_session

from datetime import datetime


async def fetch_test_data():
    async with async_session() as session:
        query = select(Measurement)
        result = await session.execute(query)
        measurements = result.scalars().all()
        return measurements


async def initialize_test_data():
    async with async_session() as session:
        async with session.begin():

            platform = Platform(name="Example Platform")
            session.add(platform)
            await session.flush()
            # Add example MeasurementType if it does not exist
            measurement_type1 = MeasurementType(
                physical_parameter="Temperature", unit="Celsius"
            )
            measurement_type2 = MeasurementType(
                physical_parameter="Humidity", unit="Humidity"
            )

            # Add to session
            session.add_all([measurement_type1, measurement_type2])
            await session.flush()  # Ensure ID is generated

            # Add example Sensors using the measurement_type ID
            sensor1 = Sensor(
                platform_id=platform.id,  # Replace with valid platform_id
                measurement_type_id=measurement_type1.id,
            )
            sensor2 = Sensor(
                platform_id=platform.id,  # Replace with valid platform_id
                measurement_type_id=measurement_type2.id,
            )

            # Add sensors to the session
            session.add_all([sensor1, sensor2])
            await session.flush()  # Ensure IDs are generated for sensors

            # Create example Measurement objects using the sensors' IDs
            measurement1 = Measurement(
                sensor_id=sensor1.id,  # Use the ID generated for sensor1
                value=25.5678,
                date=datetime(2024, 12, 8, 10, 0, 0),  # Example timestamp
            )
            measurement2 = Measurement(
                sensor_id=sensor2.id,  # Use the ID generated for sensor2
                value=30.1234,
                date=datetime(2024, 12, 8, 11, 0, 0),  # Example timestamp
            )

            # Add measurements to the session
            session.add_all([measurement1, measurement2])

    return {"message": "Measurements table initialized with example rows."}


def parse_message(message: str) -> dict:
    # The message is a json string, turn it into a dictionary
    try:
        message_dict = json.loads(message)
    except json.JSONDecodeError:
        print("Error parsing message")
        return {"error": "Invalid JSON format"}
    return message_dict


async def save_sample_to_db(message: str):
    message_dict = parse_message(message)
    if "error" in message_dict:
        return

    async with async_session() as session:
        async with session.begin():
            session.add_all(name=[message_dict["name"]])

    print("Inserting data into the database")