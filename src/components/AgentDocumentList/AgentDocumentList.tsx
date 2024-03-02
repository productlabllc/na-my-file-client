// import TableRow from '@mui/material/TableRow';
// import TableCell from '@mui/material/TableCell';
// import { ArrowDropDown } from '@mui/icons-material';
// import MUIDataTable from 'mui-datatables';
// import { Button, Grid, Typography } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';

// import { User } from '../../types/User';
// import Collection from '../../types/Collection';
// import AgentCollection from '../AgentCollection/AgentCollection';

// import MockAgentAPIResponse from '../../assets/mock-data/mock-agent-api-response.json';

// const columns = [
//   {
//     name: 'givenName',
//     label: 'First Name'
//     // Default options:
//     // options: {
//     //   filter: true,
//     //   sort: true
//     // },
//   },
//   {
//     name: 'familyName',
//     label: 'Last Name'
//   },
//   {
//     name: 'email',
//     label: 'Email'
//   },
//   {
//     name: 'dob',
//     label: 'Date of Birth',
//     options: {
//       sort: false // TODO add date sort function
//     }
//   },
//   {
//     name: 'dhsCaseNumber',
//     label: 'Case Number'
//   },
//   {
//     name: 'sharedAt',
//     label: 'Date Shared',
//     options: {
//       sort: false // TODO add date sort function
//     }
//   },
//   {
//     name: 'locale',
//     label: 'Language',
//     options: {
//       sort: false
//     }
//   }
// ];

// // Type for the API response of clients and their shared collections
// interface AgentDataInterface {
//   client: User;
//   sharedAt: string;
//   collections: Collection[];
// }

// // Mock API response, + hack to replace datestrings in the nested JSON with dates
// const apiData: AgentDataInterface[] = MockAgentAPIResponse.map((client) => ({
//   ...client,
//   collections: client.collections.map((collection) => ({
//     ...collection,
//     createdAt: new Date(collection.createdAt),
//     documents: collection.documents.map((document) => ({
//       ...document,
//       createdAt: new Date(document.createdAt),
//       updatedAt: new Date(document.updatedAt)
//     }))
//   }))
// }));

// function AgentDocumentList() {
//   // Turn API response into main table rows.
//   const getTableRows = () =>
//     apiData.map((data) => ({ ...data.client, sharedAt: data.sharedAt }));

//   // Render the expanded client content for a given table row.
//   const renderClientContent = (
//     rowData: string[],
//     rowMeta: { dataIndex: number; rowIndex: number }
//   ) => {
//     const client = apiData[rowMeta.dataIndex];

//     const totalClientDocuments = client.collections
//       .map((collection) => collection.documents.length)
//       .reduce((a, b) => a + b);

//     const colSpan = rowData.length + 1;

//     return (
//       <TableRow className="bg-gray-50">
//         <TableCell colSpan={colSpan} width="100%">
//           <Grid container>
//             <Grid item xs={8} className="p-8 py-4 pb-0">
//               Shared documents
//               {client.collections.map((collection) => (
//                 <AgentCollection collection={collection} key={collection.id} />
//               ))}
//             </Grid>
//             <Grid item xs={4} className="flex justify-center p-8 border-l">
//               <div className="flex flex-col justify-center">
//                 <Typography className="!mb-3">
//                   Total number of documents: {totalClientDocuments}
//                 </Typography>

//                 <Button
//                   component={RouterLink}
//                   to={`/collections/owner/${client.client.id}`}
//                   variant="contained"
//                 >
//                   View all documents
//                 </Button>
//               </div>
//             </Grid>
//           </Grid>
//         </TableCell>
//       </TableRow>
//     );
//   };

//   return (
//     <MUIDataTable
//       title={'MyFile Client list'}
//       data={getTableRows()}
//       columns={columns}
//       options={{
//         expandableRows: true,
//         expandableRowsHeader: false,
//         expandableRowsOnClick: true,
//         isRowExpandable: (dataIndex: number) => true,
//         selectableRows: 'none',
//         selectableRowsHideCheckboxes: true,
//         searchAlwaysOpen: true,
//         rowsExpanded: [],
//         renderExpandableRow: renderClientContent
//         // tableBodyMaxHeight: '60vh' // Optionally, limits height and scrolls content
//       }}
//       components={{
//         ExpandButton: () => <ArrowDropDown />
//       }}
//     />
//   );
// }

// export default AgentDocumentList;
