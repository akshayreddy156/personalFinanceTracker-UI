import { Box, Paper, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import type { CategoryDataResponse } from "../../types/report.ypes";

interface Props {
  data: CategoryDataResponse | null;
}

export default function CategoryBreakdownChart({ data }: Props) {
  if (!data || !data.data.breakdown.length) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Category Breakdown
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No category data available
        </Typography>
      </Paper>
    );
  }

  const chartData = data.data.breakdown.map((item) => ({
    id: item.categoryId,
    value: item.total,
    label: item.categoryName,
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Category Breakdown -{" "}
        {new Date(data.data.year, data.data.month - 1).toLocaleDateString(
          "en-US",
          { month: "long", year: "numeric" }
        )}
      </Typography>
      <Box sx={{ width: "100%", height: 365 }}>
        <PieChart
          series={[
            {
              data: chartData,
              highlightScope: { fade: "global", highlight: "item" },
            },
          ]}
          height={350}
        />
      </Box>
    </Paper>
  );
}
