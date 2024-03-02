// import { Button, Chip, Container, Divider, Grid } from '@mui/material';
// import { useBoundStore } from '../../store/store';
// import PathBar from '../../components/PathBar/PathBar';
// import { Link } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
// import Collection from '../../types/Collection';
// import DocumentsList from '../DocumentsList/DocumentsList';
// import SideBar from '../../layouts/SideBar/SideBar';
// import InfoItem from '../InfoItem';
// import { format } from 'date-fns';

// function CollectionContainer({
//   collection
// }: {
//   collection: Collection | null;
// }) {
//   const { getCollectionDescription, userType } = useBoundStore();

//   const showAgentSidebar = userType === 'agent';

//   return (
//     <Grid container spacing={2}>
//       <Grid
//         item
//         lg={showAgentSidebar ? 9 : 12}
//         md={showAgentSidebar ? 8 : 12}
//         xs={12}
//       >
//         <PathBar>
//           <Link
//             component={RouterLink}
//             underline="hover"
//             to="/dashboard"
//             fontWeight={600}
//           >
//             Dashboard
//           </Link>

//           {showAgentSidebar && (
//             <Link underline="hover" component={RouterLink} to="#">
//               Client name{' '}
//               {/*TODO add shallow client property to agent collections for easy access to client info? */}
//             </Link>
//           )}

//           {collection && (
//             <Link underline="hover" component={RouterLink} to="#">
//               {getCollectionDescription(collection)}
//             </Link>
//           )}
//         </PathBar>

//         <Divider />

//         <Container className="py-4">
//           <DocumentsList
//             documents={collection ? collection.documents : null}
//             displayAction="options"
//           />
//         </Container>
//       </Grid>

//       {showAgentSidebar && (
//         <Grid item lg={3} md={4} xs={12}>
//           <SideBar>
//             {collection && (
//               <>
//                 <Button variant="contained" fullWidth={true}>
//                   Download all files
//                 </Button>

//                 <Divider className="!my-6 !mb-4" />

//                 <InfoItem
//                   item={{
//                     key: 'Date Shared',
//                     value: format(collection.createdAt, 'MMMM do u')
//                   }}
//                 />

//                 <InfoItem
//                   item={{
//                     key: 'Shared By',
//                     value: 'Client name' // TODO add shallow client property to agent collections for easy access to client info?
//                   }}
//                 />
//               </>
//             )}
//           </SideBar>
//         </Grid>
//       )}
//     </Grid>
//   );
// }

// export default CollectionContainer;
