mkdir -p docs
cat > docs/architecture-diagrams.md << 'EOF'

# TaskFlow System Architecture Diagrams

## 🏗️ System Architecture

[Insert first flowchart here]

## 📊 API Flow

![API flow](./deepseek_mermaid_20260502_c8ecff.png)

## 🧠 AI Pipeline

![System Architecture](./deepseek_mermaid_20260502_1c1e8e.png)

## 📋 Database Schema

![Database Schema](./deepseek_mermaid_20260502_f66e0f.png)

## 🔄 Error Handling

![Error flow here](./deepseek_mermaid_20260502_74c73f.png)

## 🚀 Deployment

![Deployment architecture here](./deepseek_mermaid_20260502_02c033.png)

EOF

git add docs/architecture-diagrams.md
git commit -m "docs: Add detailed architecture diagrams for backend system"
