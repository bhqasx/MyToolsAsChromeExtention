function formatArray(arr, itemsPerLine) {
  if (!Array.isArray(arr)) return JSON.stringify(arr);
  
  if (arr.every(item => 
    typeof item !== 'object' || 
    item === null || 
    typeof item === 'number'
  )) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += itemsPerLine) {
      chunks.push(arr.slice(i, i + itemsPerLine)
        .map(item => typeof item === 'number' ? item : JSON.stringify(item))
        .join(', '));
    }
    return '[\n  ' + chunks.join(',\n  ') + '\n]';
  }
  
  return JSON.stringify(arr, null, 2);
}

document.getElementById('formatJson').addEventListener('click', () => {
  const file = document.getElementById('jsonFile').files[0];
  const itemsPerLine = parseInt(document.getElementById('itemsPerLine').value) || 5;
  
  if (!file) {
    alert('请选择一个 JSON 文件');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const jsonData = JSON.parse(e.target.result);
      
      const formattedJson = JSON.stringify(jsonData, null, 2).replace(
        /"(\w+)":\s*(\[[\s\S]*?\])/g,
        (match, key, array) => {
          try {
            const arr = JSON.parse(array);
            return `"${key}": ${formatArray(arr, itemsPerLine)}`;
          } catch (e) {
            return match;
          }
        }
      );
      
      downloadFormattedJson(formattedJson, file.name);
    } catch (error) {
      console.error('Error:', error);
      alert("无法解析 JSON 文件，请确认文件格式是否正确。\n错误信息: " + error.message);
    }
  };
  
  reader.readAsText(file);
});

function downloadFormattedJson(content, filename) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace('.json', '_formatted.json');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}