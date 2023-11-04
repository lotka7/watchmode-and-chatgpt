import User from '../../modules/SearchMovie/models/Description';
import { PaginationOptions } from './Pagination';

type RequestLocals = {
  pagination: PaginationOptions;
  user: User;
};

export default RequestLocals;
