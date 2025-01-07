import { useParams } from "react-router";
import { Button } from "./ui/button";
import { useLatestPlatformMeasurement } from "@/features/getLatestPlatformMeasurements";
import { Skeleton } from "./ui/skeleton";
import { m } from "node_modules/react-router/dist/development/fog-of-war-BkI3XFdx.d.mts";
import { Chart } from "./Chart";
import { useState } from "react";


type MeasurementProps = {
    sensor_id: number;
    value: number;
    date: string;
    unit: string;
    label: string;
}
export function MeasurementGauge({ date, sensor_id, unit, value, label }: MeasurementProps) {
    return (
        <div>
            <p className="text-center">{label}</p>
            <div className="border p-2 rounded-lg bg-zinc-900 w-32 aspect-square flex items-center justify-evenly flex-col">
                <p className="font-medium text-xl">{value} {unit}</p>
                <Button variant={'ghost'}>view</Button>
            </div>
        </div>
    )
}

const dummyTemperatureData = [
    { date: "2024-12-11T14:04:00", value: 27 },
    { date: "2024-12-11T14:03:00", value: 26 },
    { date: "2024-12-11T14:02:00", value: 25 },
    { date: "2024-12-11T14:01:00", value: 25 },
    { date: "2024-12-11T14:00:00", value: 24 },
    { date: "2024-12-11T13:59:00", value: 23 },
    { date: "2024-12-11T13:58:00", value: 22 },
    { date: "2024-12-11T13:57:00", value: 22 },
    { date: "2024-12-11T13:56:00", value: 21 },
    { date: "2024-12-11T13:55:00", value: 21 },
    { date: "2024-12-11T13:54:00", value: 29 },
    { date: "2024-12-11T13:53:00", value: 29 },
    { date: "2024-12-11T13:52:00", value: 28 },
    { date: "2024-12-11T13:51:00", value: 27 },
    { date: "2024-12-11T13:50:00", value: 25 },
    { date: "2024-12-11T13:49:00", value: 25 },
    { date: "2024-12-11T13:48:00", value: 25 },
    { date: "2024-12-11T13:47:00", value: 24 },
    { date: "2024-12-11T13:46:00", value: 23 },
    { date: "2024-12-11T13:45:00", value: 21 },
    { date: "2024-12-11T13:44:00", value: 29 },
    { date: "2024-12-11T13:43:00", value: 25 },
    { date: "2024-12-11T13:42:00", value: 21 },
    { date: "2024-12-11T13:41:00", value: 20 }
]

const dummyHumidityData = [
    { date: "2024-12-11T14:04:00", value: 60 },
    { date: "2024-12-11T14:03:00", value: 50 },
    { date: "2024-12-11T14:02:00", value: 59 },
    { date: "2024-12-11T14:01:00", value: 58 },
    { date: "2024-12-11T14:00:00", value: 57 },
    { date: "2024-12-11T13:59:00", value: 56 },
    { date: "2024-12-11T13:58:00", value: 55 },
    { date: "2024-12-11T13:57:00", value: 54 },
    { date: "2024-12-11T13:56:00", value: 53 },
    { date: "2024-12-11T13:55:00", value: 52 },
    { date: "2024-12-11T13:54:00", value: 51 },
    { date: "2024-12-11T13:53:00", value: 50 },
    { date: "2024-12-11T13:52:00", value: 30 },
    { date: "2024-12-11T13:51:00", value: 25 },
    { date: "2024-12-11T13:50:00", value: 29 },
    { date: "2024-12-11T13:49:00", value: 30 },
    { date: "2024-12-11T13:48:00", value: 49 },
    { date: "2024-12-11T13:47:00", value: 49 },
    { date: "2024-12-11T13:46:00", value: 49 },
    { date: "2024-12-11T13:45:00", value: 44 },
    { date: "2024-12-11T13:44:00", value: 43 },
    { date: "2024-12-11T13:43:00", value: 41 },
    { date: "2024-12-11T13:42:00", value: 44 },
    { date: "2024-12-11T13:41:00", value: 40 }
]

type PlatformInfoParams = {
    platformId: string;
}

export default function PlatformInfo() {
    const params = useParams<PlatformInfoParams>();
    const { data, refetch, isLoading } = useLatestPlatformMeasurement({ platformId: parseInt(params.platformId!) })
    const [selectedMeasurement, setSelectedMeasurement] = useState<'Temperature' | "Humidity">('Temperature')

    return (
        <main className=" mx-auto max-w-screen-xl mt-10">
            <Button variant={'link'} className="mb-8 text-muted-foreground font-medium">{"< back"}</Button>
            <h1 className="text-3xl mb-4">Platform: {params.platformId}</h1>
            <div className="border rounded-md p-4 bg-zinc-900">
                <p className="text-xl mb-4">Current measurements</p>
                {isLoading ? (
                    <Skeleton className="w-full h-20" />
                ) : (
                    <>
                        <div className="flex gap-6 mb-8">
                            {Object.entries(data!.measurements).map(([key, value]) => {
                                return (
                                    <div key={key}>
                                        <p className="text-center">{key}</p>
                                        <div className="border p-2 rounded-lg bg-zinc-900 w-32 aspect-square flex items-center justify-evenly flex-col">
                                            <p className="font-medium text-xl">{value[0].value} {value[0].unit}</p>
                                            <Button
                                                onClick={() => setSelectedMeasurement(key as 'Temperature' | 'Humidity')}
                                                variant={'ghost'}
                                            >view</Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <Chart
                            label={selectedMeasurement}
                            data={selectedMeasurement === 'Temperature' ? dummyTemperatureData : dummyHumidityData}
                        />
                    </>
                )}
            </div>
            {/* <div className="mt-12 border rounded-md p-4 bg-zinc-900"> */}
            {/* </div> */}
        </main >
    )
}
