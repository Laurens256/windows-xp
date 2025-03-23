<script lang="ts">
	import { fileUtil } from '$utils';

	const path = 'laurens-duin-resume.pdf';

	$effect(() => {
		try {
			fileUtil.downloadFile({ url: path, filename: path });
		} catch { /* let user download manually */ }
	});
</script>

<!-- eslint-disable-next-line @stylistic/max-len -->
<p>My resume should start downloading. In case that didn't work, <a href={path} download={path}>click here to start the download manually</a></p>
