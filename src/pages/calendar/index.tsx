import {useState} from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction"
import {Box, List, ListItem, ListItemText, Typography, useTheme} from "@mui/material";
import Header from "../../components/Header.tsx";
import {tokens} from "../../themes.tsx";


