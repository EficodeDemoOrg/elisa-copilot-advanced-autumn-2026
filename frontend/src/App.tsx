import { ChartHeader } from './components/ChartHeader';
import { GanttChart } from './components/GanttChart';
import { useChart } from './hooks/useChart';

export function App() {
  const { chart, loading, error, updateTimeline, addTask, updateTask, deleteTask } = useChart();

  return (
    <div className="app">
      <div className="app-header">
        <h1>Gantt Chart</h1>
      </div>
      {error && <div className="error">Error: {error}</div>}
      {loading || !chart ? (
        <div>Loading…</div>
      ) : (
        <>
          <ChartHeader
            startDate={chart.startDate}
            endDate={chart.endDate}
            onChange={updateTimeline}
          />
          <GanttChart
            chart={chart}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </>
      )}
    </div>
  );
}
