import { useBoundStore } from '../../store/store';
import UserForm from '../../components/UserForm/UserForm';

function EditProfile() {
  const { getUser, updateUser } = useBoundStore();
  return (
    <div>
      <UserForm user={getUser()} updateUser={updateUser} />
    </div>
  );
}

export default EditProfile;
