import { useBoundStore } from '../../store/store';
import UserForm from '../../components/UserForm/UserForm';

function EditProfile() {
  const { getUserData } = useBoundStore();
  const user = getUserData();
  return (
    <div>
      {/* @ts-expect-error fix when store is ready */}
      <UserForm user={user} updateUser={null} />
    </div>
  );
}

export default EditProfile;
