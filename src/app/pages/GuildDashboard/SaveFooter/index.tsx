import React from 'react';
import './SaveFooter.scss';

interface Props {
	enabled: boolean;
	buttonsEnabled: boolean;
	onSave?(): void;
	onReset?(): void;
}

const SaveFooter: React.FC<Props> = ({
	buttonsEnabled,
	onSave,
	onReset,
	enabled,
}) => (
	<div
		className="save-footer"
		style={{
			transform: !enabled ? 'translateY(150%)' : 'none',
		}}>
		<h5 className="text-light">Careful - you have unsaved changes!</h5>
		<div className="save-right">
			<input
				type="button"
				disabled={!buttonsEnabled}
				className="reset-button text-light"
				onClick={onReset}
				value="Reset"
			/>
			<input
				onClick={onSave}
				disabled={!buttonsEnabled}
				className="save-button text-light"
				type="button"
				value={buttonsEnabled ? 'Save Changes' : '...'}
			/>
		</div>
	</div>
);

export default SaveFooter;
