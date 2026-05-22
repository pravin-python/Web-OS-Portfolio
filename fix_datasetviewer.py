import re

with open("src/apps/DatasetViewer/DatasetViewer.tsx", "r") as f:
    content = f.read()

# Fix parseJSONToCSVData any type
content = content.replace("function parseJSONToCSVData(data: any[]): CSVData {", "function parseJSONToCSVData(data: Record<string, unknown>[]): CSVData {")

# Fix type assertion any types
content = content.replace("(activeDataset as any).path", "'path' in activeDataset ? activeDataset.path : ''")
content = content.replace("(activeDataset as any).key", "'key' in activeDataset ? activeDataset.key : ''")

# Fix exhaustive deps
content = re.sub(r'\}, \[activeTab, activeDataset, apiDataMap\]\);', '}, [activeDataset, apiDataMap]);', content)

with open("src/apps/DatasetViewer/DatasetViewer.tsx", "w") as f:
    f.write(content)
