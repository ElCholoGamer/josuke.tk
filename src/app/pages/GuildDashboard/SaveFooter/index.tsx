import React from 'react';
import './SaveFooter.scss';

interface Props {
	enabled: boolean;
	buttonsEnabled: boolean;
	onSave?: () => void;
	onReset?: () => void;
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
		<h4 style={{ color: 'white' }}>Careful --- you have unsaved changes!</h4>
		<div className="save-right">
			<input
				type="button"
				disabled={!buttonsEnabled}
				className="reset-button"
				onClick={onReset}
				value="Reset"
			/>
			<input
				onClick={onSave}
				disabled={!buttonsEnabled}
				className="save-button"
				type="button"
				value={buttonsEnabled ? 'Save Changes' : '...'}
			/>
		</div>
	</div>
);

export default SaveFooter;
