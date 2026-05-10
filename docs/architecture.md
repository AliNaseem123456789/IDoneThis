mkdir -p docs
cat > docs/architecture-diagrams.md << 'EOF'

# TaskFlow System Architecture Diagrams

## System Architecture

[Insert first flowchart here]

## API Flow

![API flow](./api.png)

## AI Pipeline

![System Architecture](./system.png)

## Database Schema

![Database Schema](./database.png)

##  Error Handling

![Error flow here](./error.png)

##  Deployment

![Deployment architecture here](./deployment.png)

EOF

git add docs/architecture-diagrams.md
git commit -m "docs: Add detailed architecture diagrams for backend system"
