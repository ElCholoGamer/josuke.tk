import React from 'react';
import Setting from 'components/Setting';
import FileInfo from './FileInfo';
import './Webhook.scss';

interface WebhookData {
	url: string;
	content: string;
	tts: boolean;
	username: string;
	avatar_url: string;
	files: File[];
}

const defaultData: WebhookData = {
	url: '',
	content: '',
	tts: false,
	username: '',
	avatar_url: '',
	files: [],
};

const Webhook: React.FC = () => {
	const [data, setData] = React.useState(defaultData);
	const [posting, setPosting] = React.useState(false);
	const fileInput = React.useRef<HTMLInputElement>(null);

	const changeFiles = ({
		target: { files },
	}: React.ChangeEvent<HTMLInputElement>) => {
		if (files?.length) {
			setData(prev => ({
				...prev,
				files: [...prev.files, ...files],
			}));
		}
	};

	const handleChange = ({
		target: { name, value },
	}: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setData((prev: any) => ({
			...prev,
			[name]: value.trimStart(),
		}));
	};

	const postWebhook = () => {
		const { username, url, content, avatar_url, tts, files } = data;
		setPosting(true);

		// Create form data
		const form = new FormData();
		form.append('content', content);
		form.append('username', username);
		form.append('avatar_url', avatar_url);
		form.append('tts', tts.toString());
		files.forEach((file, index) => form.append(`file${index + 1}`, file));

		fetch(url, {
			method: 'POST',
			body: form,
		})
			.then(console.log)
			.catch(console.error)
			.finally(() => {
				setPosting(false);
			});
	};

	const deleteFile = (file: File) => {
		setData(prev => ({
			...prev,
			files: prev.files.filter(f => f !== file),
		}));
	};

	const { url, files, content } = data;
	const regex = /^https:\/\/discord(app)?.com\/api\/webhooks\/[0-9]{18}\/[a-zA-Z0-9_]{40,}$/;
	const disabled =
		posting || !regex.test(url) || (!files.length && !content.length);

	return (
		<main className="webhook-main">
			<h1>Send a Webhook</h1>
			<div className="webhook-url">
				<h3>Webhook URL: </h3>
				<input
					name="url"
					type="text"
					placeholder="https://discordapp.com/api/webhooks/"
					value={data.url}
					onChange={handleChange}
				/>
				<input
					className="linked-button"
					type="button"
					value={posting ? '...' : 'Post Webhook'}
					disabled={disabled}
					onClick={postWebhook}
				/>
			</div>
			<div className="message">
				<h3>Message content:</h3>
				<br />
				<textarea
					placeholder="An interesting message..."
					name="content"
					value={data.content}
					onChange={handleChange}
					maxLength={2000}
				/>
			</div>
			<div className="file-list">
				<h3>Files:</h3>
				<br />
				<input
					type="file"
					multiple
					ref={fileInput}
					onChange={changeFiles}
					style={{ display: 'none' }}
				/>
				<input
					onClick={() => fileInput.current?.click()}
					type="button"
					id="upload-file"
					value="Attach files"
				/>
				<div>
					{Array.prototype.map.call(data.files || [], file => (
						<FileInfo
							key={`${file.name}-${file.lastModified}`}
							file={file}
							deleteFile={deleteFile}
						/>
					))}
				</div>
			</div>
			<Setting
				type="text"
				config={data}
				setConfig={setData}
				textPlaceholder="A custom username"
				maxLength={80}
				stringFormat={str => str.trim()}
				name="username">
				Override username:
			</Setting>
			<Setting
				type="text"
				config={data}
				setConfig={setData}
				name="avatar_url"
				stringFormat={str => str.trim()}
				textPlaceholder="A custom avatar URL">
				Override avatar image:
			</Setting>
			<Setting type="toggle" config={data} setConfig={setData} name="tts">
				Send as TTS message:
			</Setting>
		</main>
	);
};

export default Webhook;
