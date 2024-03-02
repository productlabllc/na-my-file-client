// import {
//   Avatar,
//   Box,
//   Divider,
//   Drawer,
//   IconButton,
//   Skeleton,
//   Typography
// } from '@mui/material';
// import { useBoundStore } from '../../store/store';
// import { Close, Visibility } from '@mui/icons-material';
// import { ActivityItem } from '../../types/Activity';
// import { format } from 'date-fns';

// const drawerWidth = 375;

// function ActivitySideBar() {
//   const {
//     isActivitySidebarOpen,
//     setActivitySidebarOpen,
//     groupActivitiesByDate
//   } = useBoundStore();

//   const renderActivityGroups = () => {
//     const groups = groupActivitiesByDate();

//     if (!groups) {
//       return <Skeleton height="40vh" />;
//     } else {
//       return groups.map((activityGroup, i) => (
//         <div key={i}>
//           <Box className="bg-slate-200 p-2 mb-4 rounded">
//             <Typography variant="h5">
//               {format(activityGroup.date, 'MMM do')}
//             </Typography>
//           </Box>

//           {activityGroup.activities.map((activity) =>
//             renderActivityItem(activity)
//           )}
//         </div>
//       ));
//     }
//   };

//   const renderActivityItem = (activity: ActivityItem) => {
//     // TODO Various ActivityItem types & icons, child items (expandable list of people/documents)

//     return (
//       <div key={activity.id}>
//         <div className="flex mb-2">
//           <div className="grow-0 mr-4">
//             <Avatar className="!bg-primary">
//               <Visibility />
//             </Avatar>
//           </div>

//           <div className="grow-1">
//             <Typography className="!font-semibold">
//               <span className="text-primary">{activity.principal.name}</span>
//               {` ${activity.actionDescription}`}
//               <span className="text-primary">{` ${activity.resource.name}`}</span>
//             </Typography>

//             <Typography className="text-disabled">
//               {format(activity.date, 'h:mma')}
//             </Typography>
//           </div>
//         </div>

//         <Divider className="!my-4" />
//       </div>
//     );
//   };

//   return (
//     <Drawer
//       variant="temporary"
//       open={isActivitySidebarOpen}
//       onClose={() => setActivitySidebarOpen(false)}
//       ModalProps={{
//         keepMounted: true
//       }}
//       sx={{
//         '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
//       }}
//       anchor="right"
//     >
//       <Box className="relative py-8 px-4 md:px-8">
//         <Typography variant="h3" className="!mb-8">
//           Activity Log
//         </Typography>

//         <IconButton
//           onClick={() => setActivitySidebarOpen(false)}
//           sx={{ position: 'absolute', top: '26px', right: '1rem' }}
//         >
//           <Close fontSize="medium" />
//         </IconButton>

//         {renderActivityGroups()}
//       </Box>
//     </Drawer>
//   );
// }

// export default ActivitySideBar;
