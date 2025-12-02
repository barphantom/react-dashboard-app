import {useState} from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction"
import {
    type DateSelectArg,
    type EventClickArg,
    type EventApi,
    formatDate
} from "@fullcalendar/core";
import {Box, List, ListItem, ListItemText, Typography, useTheme} from "@mui/material";
import Header from "../../components/Header.tsx";
import {tokens} from "../../themes.tsx";

const Calendar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);

    const handleDateClick = (selected: DateSelectArg) => {
        const title = prompt("Please enter a new title for your event")
        const calendarApi = selected.view.calendar
        calendarApi.unselect()

        if (title) {
            calendarApi.addEvent({
                id: `${selected.startStr}-${title}`,
                title,
                start: selected.startStr,
                end: selected.endStr,
                allDay: selected.allDay
            })
        }
    };

    const handleEventClick = (selected: EventClickArg) => {
        if (window.confirm(`Are you sure you want to delete the event '${selected.event.title}'`)) {
            selected.event.remove();
        }
    };

    return (
        <Box m="20px">
            <Header title="Calendar" subtitle="Full Calendar Interactive Page"/>
            <Box display="flex" justifyContent="space-between">
                {/* Left side */}
                <Box
                    flex="1 1 20%"
                    p="15px"
                    borderRadius="4px"
                    sx={{
                        backgroundColor: colors.primary[400]
                    }}
                >
                    <Typography variant="h5">Events</Typography>
                    <List>
                        {currentEvents.map((event) => (
                            <ListItem
                                key={event.id}
                                sx={{
                                    backgroundColor: colors.greenAccent[500],
                                    margin: "10px 0",
                                    borderRadius: "2px",
                                }}
                            >
                                <ListItemText
                                    primary={event.title}
                                    secondary={
                                        <Typography>
                                            {formatDate(event.start!, { // Wykrzyknik (!) mówi TS, że data na pewno istnieje
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
                {/* Right side - Calendar */}
                <Box flex="1 1 100%" ml="15px">
                    <FullCalendar
                        height="75vh"
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin
                        ]}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
                        }}
                        initialView="dayGridMonth"
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        select={handleDateClick}
                        eventClick={handleEventClick}
                        eventsSet={(events) => setCurrentEvents(events)}
                        initialEvents={[
                            {id: "1234", title: "All-day event", date: "2025-09-14"},
                            {id: "4321", title: "Timed event", date: "2025-09-28"},
                        ]}
                    />
                </Box>
            </Box>
        </Box>
    )
}

export default Calendar;