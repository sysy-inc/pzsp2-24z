import { QueryConfig } from '@/lib/react-query'
// import { QuerqyConfig, ReqQueryOptions } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'

export type RowType = {
    [key: string]: string
}

export type PlatformLastestMeasurement = {
    measurements: {
        [key: string]: {
            sensor_id: number
            value: number
            date: string
            unit: string
        }[]
    }
}

type GetTableDataOptions = {
    platformId: number
}
async function getPlatformLatestMeasurement({ platformId }: GetTableDataOptions): Promise<PlatformLastestMeasurement> {
    const res = await fetch(`http://localhost:8000/api/platforms/${platformId}/latest-measurements`)
    const data = await res.json()
    return data as PlatformLastestMeasurement
}

export function getTableDataQueryOptions({ platformId }: GetTableDataOptions) {
    return {
        queryKey: ['platformData', platformId],
        queryFn: () => getPlatformLatestMeasurement({ platformId }),
    };
}

type UseTableDataOptions = {
    platformId: number,
    queryConfig?: QueryConfig<typeof getPlatformLatestMeasurement>
}

export function useLatestPlatformMeasurement({ platformId, queryConfig }: UseTableDataOptions) {
    return useQuery({
        ...getTableDataQueryOptions({ platformId }),
        ...queryConfig
    })
}
