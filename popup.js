document.getElementById("formatJson").addEventListener("click", function () {
  const fileInput = document.getElementById("jsonFile");
  if (fileInput.files.length === 0) {
    alert("请选择一个 JSON 文件。");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const jsonData = JSON.parse(e.target.result);
      const formattedJson = JSON.stringify(jsonData, null, 4);
      downloadFormattedJson(formattedJson, file.name);
    } catch (error) {
      alert("无法解析 JSON 文件，请确认文件格式是否正确。");
    }
  };

  reader.readAsText(file);
});

function downloadFormattedJson(formattedJson, originalFileName) {
  const blob = new Blob([formattedJson], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = originalFileName.replace(".json", "_readable.json");
  a.click();
  URL.revokeObjectURL(url);
}