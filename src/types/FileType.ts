interface FileType {
  id: string;
  thumbnailUrl: string;
  name: string;
  file: File | string;
  old?: boolean;
  size: number;
  type: string;
}

export default FileType;
