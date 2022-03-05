import QRCode from "qrcode";

interface IProps {
	id: number;
	name: string;
}

export const createQRcode = async (data: IProps[]): Promise<string | false> => {
	try {
		if (data) {
			let allSvgQrHtml = ``;

			for (let i = 0; i < data.length; i++) {
				if (data[i]) {
					const QrSvg = await QRCode.toString(`${data[i].id}`);

					if (QrSvg) {
						allSvgQrHtml += `
						<div
							style="
								display: flex;
								flex-direction: column;
								width: 20vw;
								margin-right: 2vw;
								margin-left: 2vw;
							"
						>
							<p style="text-align: center; font-weight: bold">
								${data[i].name}
							</p>
							${QrSvg}
						</div>
					`;
					}
				}
			}
			const html = `
				<html>
					<div style="display: flex; flex-wrap: wrap">
						${allSvgQrHtml}
					</div>
				</html>
			`;

			return html;
		} else {
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
};
