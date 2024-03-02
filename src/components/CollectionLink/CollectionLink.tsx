// import { Link as RouterLink } from 'react-router-dom';
// import Collection from '../../types/Collection';
// import { ListItem, ListItemButton } from '@mui/material';
// import { Folder } from '@mui/icons-material';
// import { useBoundStore } from '../../store/store';

// function CollectionLink({ collection }: { collection: Collection }) {
//   const { getCollectionDescription } = useBoundStore();

//   return (
//     <ListItem disablePadding key={collection.id} className="border rounded">
//       <ListItemButton
//         component={RouterLink}
//         to={`/collections/${collection.id}`}
//         className="!py-6"
//       >
//         <Folder className="mr-4 h-16 w-16" />

//         <h2>{getCollectionDescription(collection)}</h2>
//       </ListItemButton>
//     </ListItem>
//   );
// }

// export default CollectionLink;
