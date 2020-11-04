import React from 'react';
import './FileInfo.scss';

interface Props {
	file: File;
	deleteFile: (file: File) => void;
}

const FileInfo: React.FC<Props> = ({ file, deleteFile }) => (
	<div className="file-info">
		{file.name}
		<input type="button" onClick={() => deleteFile(file)} value="Remove" />
	</div>
);

export default FileInfo;
