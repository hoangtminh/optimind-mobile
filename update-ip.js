const os = require("os");
const fs = require("fs");
const path = require("path");

// Hàm lấy IPv4 máy tính
function getLocalIPv4() {
	const interfaces = os.networkInterfaces();
	for (const name of Object.keys(interfaces)) {
		for (const iface of interfaces[name]) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return "localhost";
}

const ip = getLocalIPv4();
const configPath = path.join(__dirname, "constants", "ApiConfig.ts"); // Bạn có thể đổi đường dẫn tùy ý

// Nội dung file cấu hình
const content = `// File này được tạo tự động bởi update-ip.js\nexport const BASE_URL = "http://${ip}:8080";\n`;

// Tạo thư mục nếu chưa có
const dir = path.dirname(configPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(configPath, content);
console.log(
	`🚀 [Optimind] API Base URL đã được cập nhật thành: http://${ip}:8080`,
);
