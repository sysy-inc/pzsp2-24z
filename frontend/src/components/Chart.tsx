import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type ChartProps = {
    data: {
        date: string,
        value: number,
    }[],
    label: string,
}
export function Chart(
    { data, label }: ChartProps
) {

    // const label = "Temperature"
    // const label = "Temperature"
    // let chartData = [
    //     { date: "2024-12-11T14:04:00", value: 27 },
    //     { date: "2024-12-11T14:03:00", value: 26 },
    //     { date: "2024-12-11T14:02:00", value: 25 },
    //     { date: "2024-12-11T14:01:00", value: 25 },
    //     { date: "2024-12-11T14:00:00", value: 24 },
    //     { date: "2024-12-11T13:59:00", value: 23 },
    //     { date: "2024-12-11T13:58:00", value: 22 },
    //     { date: "2024-12-11T13:57:00", value: 22 },
    //     { date: "2024-12-11T13:56:00", value: 21 },
    //     { date: "2024-12-11T13:55:00", value: 21 },
    //     { date: "2024-12-11T13:54:00", value: 29 },
    //     { date: "2024-12-11T13:53:00", value: 29 },
    //     { date: "2024-12-11T13:52:00", value: 28 },
    //     { date: "2024-12-11T13:51:00", value: 27 },
    //     { date: "2024-12-11T13:50:00", value: 25 },
    //     { date: "2024-12-11T13:49:00", value: 25 },
    //     { date: "2024-12-11T13:48:00", value: 25 },
    //     { date: "2024-12-11T13:47:00", value: 24 },
    //     { date: "2024-12-11T13:46:00", value: 23 },
    //     { date: "2024-12-11T13:45:00", value: 21 },
    //     { date: "2024-12-11T13:44:00", value: 29 },
    //     { date: "2024-12-11T13:43:00", value: 25 },
    //     { date: "2024-12-11T13:42:00", value: 21 },
    //     { date: "2024-12-11T13:41:00", value: 20 }
    // ]
    const chartData = data.map((item) => {
        return {
            ...item,
            [label]: item.value,
        }
    })


    const chartConfig = {
        visitors: {
            label: "Visitors",
        },
        // desktop: {
        //     label: "Desktop",
        //     color: "hsl(var(--chart-1))",
        // },
        [label]: {
            label: label,
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig

    const [dateEndState, setDateEndState] = React.useState(new Date())
    const [dateStartState, setDateStartState] = React.useState(new Date('2023'))

    // const filteredData = chartData.filter((item) => {
    //     const date = new Date(item.date)
    //     const referenceDate = new Date("2024-06-30")
    //     let daysToSubtract = 90
    //     if (timeRange === "30d") {
    //         daysToSubtract = 30
    //     } else if (timeRange === "7d") {
    //         daysToSubtract = 7
    //     }
    //     const startDate = new Date(referenceDate)
    //     startDate.setDate(startDate.getDate() - daysToSubtract)
    //     return date >= startDate
    // })

    const [filteredData, setFilteredData] = React.useState(chartData.filter((item) => {
        const dateObj = new Date(item.date)
        const isBetween = dateObj >= dateStartState && dateObj <= dateEndState
        return isBetween
    }).sort((a, b) => a.date.localeCompare(b.date)))

    React.useEffect(() => {
        setFilteredData(chartData.filter((item) => {
            const dateObj = new Date(item.date)
            const isBetween = dateObj >= dateStartState && dateObj <= dateEndState
            return isBetween
        }).sort((a, b) => a.date.localeCompare(b.date)))
    }, [dateEndState, dateStartState, chartData])

    console.log(filteredData)

    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>{label} Chart</CardTitle>
                    {/* <CardDescription>
                        Showing total visitors for the last 3 months
                    </CardDescription> */}
                </div>
                {/* <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select> */}
                <div className="flex gap-4">
                    <Label>
                        <p className="text-xs text-muted-foreground">from</p>
                        <Input
                            defaultValue={dateStartState.toLocaleString()}
                            onChange={(e) => setDateStartState(new Date(e.target.value))}
                        ></Input>
                    </Label>
                    <Label>
                        <p className="text-xs text-muted-foreground">to</p>
                        <Input
                            defaultValue={dateEndState.toLocaleString()}
                            onChange={(e) => setDateEndState(new Date(e.target.value))}
                        ></Input>
                    </Label>

                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            {/* <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-desktop)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient> */}
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-mobile)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "numeric",
                                            second: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey={label}
                            type="natural"
                            fill="rgba(0,0,0,0)"
                            // stroke="var(--color-temperature)"
                            stackId="a"
                        />
                        {/* <Area
                            dataKey="desktop"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-desktop)"
                            stackId="a"
                        /> */}
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
