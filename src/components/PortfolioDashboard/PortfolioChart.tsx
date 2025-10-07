import { ResponsiveLine } from '@nivo/line'
import { tokens } from "../../themes.tsx"
import { useTheme } from "@mui/material";

const data = [
    {
        id: "Portfolio Value",
        data: [
            { x: "2025-09-01", y: 10000 },
            { x: "2025-09-02", y: 10050 },
            { x: "2025-09-03", y: 10120 },
            { x: "2025-09-04", y: 10080 },
            { x: "2025-09-05", y: 10250 },
            { x: "2025-09-06", y: 10280 },
            { x: "2025-09-07", y: 10320 },
            { x: "2025-09-08", y: 10200 },
            { x: "2025-09-09", y: 10150 },
            { x: "2025-09-10", y: 9800 },
            { x: "2025-09-11", y: 9850 },
            { x: "2025-09-12", y: 9900 },
            { x: "2025-09-13", y: 10020 },
            { x: "2025-09-14", y: 10080 },
            { x: "2025-09-15", y: 10500 },
            { x: "2025-09-16", y: 10450 },
            { x: "2025-09-17", y: 10380 },
            { x: "2025-09-18", y: 10420 },
            { x: "2025-09-19", y: 10550 },
            { x: "2025-09-20", y: 11000 },
            { x: "2025-09-21", y: 10950 },
            { x: "2025-09-22", y: 10880 },
            { x: "2025-09-23", y: 10720 },
            { x: "2025-09-24", y: 10650 },
            { x: "2025-09-25", y: 10780 },
            { x: "2025-09-26", y: 10850 },
            { x: "2025-09-27", y: 10900 },
            { x: "2025-09-28", y: 11020 },
            { x: "2025-09-29", y: 11100 },
            { x: "2025-09-30", y: 11200 },
        ],
    },
]

const PortfolioChart = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <ResponsiveLine /* or Line for fixed dimensions */
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
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            axisBottom={{
                format: "%d.%m.%y",        // np. 01.09, 05.09
                tickValues: "every 2 days", // co 3 dni
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
            areaBaselineValue={9800}
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
                    {point.data.yFormatted} PLN
                </div>
            )}
        />
    )
}

export default PortfolioChart
