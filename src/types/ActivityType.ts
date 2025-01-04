export default interface ActivityType {
  id: string;
  date: string;
  // Simplified for demo:
  actionDescription: string;
  principal: {
    id: string;
    name?: string;
  };
  resource: {
    id: string;
    name?: string;
    type?: string;
  };
}

// export interface ActivityGroup {
//   date: Date;
//   activities: ActivityItem[];
// }
