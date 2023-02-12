export const download = (
  filename: string,
  content: string,
  dataType = "text/plain"
) => {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:${dataType};charset=utf-8,` + encodeURIComponent(content)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export const downloadJson = (filename: string, content: string) =>
  download(`${filename}.json`, content, "application/json");
