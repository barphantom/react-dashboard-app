import { useTheme } from "@mui/material";
import { tokens } from "../../themes.tsx"
import { ResponsiveLine } from '@nivo/line'
import type {PortfolioChartProps} from "../../types/stockTypes.tsx";


const PortfolioChart = ({ data }: PortfolioChartProps) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const getDynamicTickInterval = () => {
        if (!data || data.length === 0) {
            return "every 7 days";
        }

        const firstDate = new Date(data[0].data[0].x)
        const lastDate = new Date(data[0].data[data[0].data.length - 1].x)
        const diffDays = Math.floor(
            (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        console.log("Diff days: ", diffDays)

        if (diffDays < 10) {
            return "every 1 days"
        } else if (diffDays < 30) {
            return "every 3 days"
        } else if (diffDays < 90) {
            return "every week"
        } else if (diffDays < 365) {
            return "every month"
        } else {
            return "every 3 months"
        }
    }

    return (
        <ResponsiveLine
            data={data}
            margin={{ top: 20, right: 0, bottom: 20, left: 40 }}
            theme={{
                grid: {
                    line: {
                        stroke: colors.grey[300],
                        strokeWidth: 1,
                        strokeOpacity: 0.1
                    },
                },
                axis: {
                    domain: {
                        line: {
                            stroke: colors.grey[100],
                        }
                    },
                    legend: {
                        text: {
                            fill: colors.grey[100],
                        }
                    },
                    ticks: {
                        line: {
                            stroke: colors.grey[100],
                            strokeWidth: 1,
                        },
                        text: {
                            fill: colors.grey[100],
                        }
                    }
                },
                legends: {
                    text: {
                        fill: colors.grey[100],
                    }
                },
                tooltip: {
                    container: {
                        background: colors.primary[400],
                        color: colors.greenAccent[400],
                        fontSize: 14,
                        borderRadius: "4px",
                        padding: "10px 12px"
                    }
                },
            }}
            xScale={{
                type: "time",
                format: "%Y-%m-%d",
                precision: "day",
            }}
            xFormat="time:%d-%m-%Y"
            yScale={{ type: 'linear', min: 'auto', max: 'auto', clamp: true, stacked: true, reverse: false }}
            axisBottom={{
                format: "%d.%m.%y",        // np. 01.09, 05.09
                tickValues: getDynamicTickInterval(), // co ile dni wyświetlać wartość na Y
                legend: undefined,
                legendOffset: 36,
                legendPosition: "middle",
            }}
            axisLeft={{
                tickValues: 5,
                legend: undefined,
                legendOffset: -40
            }}
            colors={{scheme: "nivo"}}
            lineWidth={2}
            curve="linear"
            pointSize={6}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'seriesColor' }}
            pointLabelYOffset={-12}
            enableGridX={true}
            enableGridY={true}
            enableTouchCrosshair={true}
            defs={[
                {
                    id: "blueGradient",
                    type: "linearGradient",
                    colors: [
                        { offset: 0, color: colors.redAccent[400], opacity: 0.3 }, // górny
                        { offset: 0, color: colors.redAccent[400], opacity: 0.7 }, // dolny
                    ],
                },
            ]}
            fill={[{ match: "*", id: "blueGradient" }]}
            enableArea={true}
            // areaBaselineValue={"max"}
            areaOpacity={0.2}
            useMesh={true}
            enablePoints={false}
            tooltip={({ point }) => (
                <div
                    style={{
                        // width: "auto",
                        background: colors.primary[400],
                        color: colors.greenAccent[400],
                        fontSize: 14,
                        borderRadius: "4px",
                        padding: "10px 12px",
                        whiteSpace: "nowrap"
                    }}
                >
                    {point.data.yFormatted} USD
                </div>
            )}
        />
    )
}

export default PortfolioChart
