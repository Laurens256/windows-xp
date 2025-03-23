import { showSaveFilePicker } from 'native-file-system-adapter';

type DownloadFileProps = {
	url?: string;
	blob?: Blob;
	filename?: string;
};
const downloadFile = async ({ url, blob: _blob, filename }: DownloadFileProps) => {
	let blob = _blob;
	if (!blob && url) {
		const response = await fetch(url);
		blob = await response.blob();
	}

	if (!blob) throw new Error('No blob provided');

	const fileHandle = await showSaveFilePicker({
		suggestedName: filename,
	});

	await blob.stream().pipeTo(await fileHandle.createWritable());
};

export { downloadFile };
