from datetime import datetime
from typing import cast

from src.backend.utils.data_models import MeasurementFromPlatform
from src.backend.utils.database_utils.db_controller import session_factory
from src.backend.utils.database_utils.models import Measurement
from src.backend.utils.utils import validate_and_convert_arguments, jsonToModel


@validate_and_convert_arguments(model=MeasurementFromPlatform)
async def save_sample_to_db(measurement: jsonToModel[MeasurementFromPlatform]):
    """Save a measurement to the database.

    Args:
        measurement (jsonToModel[MeasurementFromPlatform]): A json string representing a measurement.
    """
    try:
        print("Inserting data into the database")

        measurement_from_platform = cast(
            MeasurementFromPlatform, measurement
        )  # This can be safely done due to calling the function with @validate_and_convert_arguments

        # Add the current date and time
        current_date = datetime.now()

        # Create the Measurement object
        measurement_object = Measurement(
            sensor_id=measurement_from_platform.sensor_id,
            value=measurement_from_platform.value,
            date=current_date,
        )

        # Save the measurement to the database
        with session_factory() as session:
            with session.begin():
                session.add(measurement_object)
                print(
                    f"Successfully saved measurement: {measurement_object.sensor_id} - {measurement_object.value} - {measurement_object.date}"
                )

    except Exception as e:
        print(f"Error saving sample to database: {e}")
