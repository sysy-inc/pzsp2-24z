import { useParams } from "react-router";
import { Button } from "./ui/button";
import { useLatestPlatformMeasurement } from "@/features/getLatestPlatformMeasurements";
import { Skeleton } from "./ui/skeleton";


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

type PlatformInfoParams = {
    platformId: string;
}

export default function PlatformInfo() {
    const params = useParams<PlatformInfoParams>();
    const { data, refetch, isLoading } = useLatestPlatformMeasurement({ platformId: parseInt(params.platformId!) })

    return (
        <main className=" mx-auto max-w-screen-xl mt-10">
            <Button variant={'link'} className="mb-8 text-muted-foreground font-medium">{"< back"}</Button>
            <h1 className="text-3xl mb-4">Platform: {params.platformId}</h1>
            <div className="border rounded-md p-4 bg-zinc-900">
                <p className="text-xl mb-8">Current measurements</p>
                {isLoading ? (
                    <Skeleton className="w-full h-20" />
                ) : (
                    <div className="flex gap-6">
                        {Object.entries(data!.measurements).map(([key, value]) => {
                            return (
                                <MeasurementGauge
                                    key={key}
                                    sensor_id={value.sensor_id}
                                    value={value.value}
                                    date={value.date}
                                    unit={value.unit}
                                    label={key}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
            <div>
                <p></p>
            </div>
        </main>
    )
}
