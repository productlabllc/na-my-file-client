// import {
//   Box,
//   FormControl,
//   InputLabel,
//   Link,
//   MenuItem,
//   Select
// } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
// import Collection from '../../types/Collection';
// import { Folder } from '@mui/icons-material';
// import { useBoundStore } from '../../store/store';

// function AgentCollection({ collection }: { collection: Collection }) {
//   const { getCollectionDescription } = useBoundStore();

//   return (
//     <Box className="border bg-white my-4 p-4 rounded flex justify-between items-center">
//       <div className="pt-1">
//         <Folder className="mr-4 h-16 w-16" />

//         <Link component={RouterLink} to={`/collections/${collection.id}`}>
//           {getCollectionDescription(collection)}
//         </Link>
//       </div>

//       <div>
//         <FormControl sx={{ minWidth: '150px' }} size="small">
//           <InputLabel>Status</InputLabel>
//           <Select
//             value={'pending'}
//             onChange={() => null}
//             label="Status"
//             fullWidth={true}
//           >
//             <MenuItem value={'pending'}>Pending</MenuItem>
//             <MenuItem value={'complete'}>Complete</MenuItem>
//           </Select>
//         </FormControl>
//       </div>
//     </Box>
//   );
// }

// export default AgentCollection;
