import React from 'react';
import ToggleSwitch from '../ToggleSwitch';
import './Setting.scss';

interface Props<T extends object> {
	type: 'toggle' | 'text' | 'textarea';
	name: keyof T;
	setConfig: (config: T) => void;
	config: T;
	stringFormat?: (str: string) => string;
	children?: any;
	textPlaceholder?: string;
	maxLength?: number;
}

const Setting = <T extends object, _>({
	name,
	type,
	setConfig,
	config,
	stringFormat,
	children,
	textPlaceholder,
	maxLength,
}: Props<T>) => {
	const handleChange = ({
		currentTarget: { value },
	}: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setConfig({
			...config,
			[name]: stringFormat ? stringFormat(value) : value,
		});
	};

	return (
		<div className="setting">
			<h3>{children}</h3>
			{type === 'toggle' ? (
				<ToggleSwitch name={name} data={config} setData={setConfig} />
			) : type === 'text' ? (
				<input
					type="text"
					value={(config[name] as any).toString()}
					onChange={handleChange}
					className="setting-input"
					placeholder={textPlaceholder}
					maxLength={maxLength}
				/>
			) : (
				<textarea
					className="setting-textarea"
					onChange={handleChange}
					value={(config[name] as any).toString()}
					maxLength={maxLength}
					placeholder={textPlaceholder}
				/>
			)}
		</div>
	);
};

export default Setting;
