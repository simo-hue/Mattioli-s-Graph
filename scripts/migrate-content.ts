import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const SOURCE_DIR = '/Users/simo/Downloads/DEV/simo-hue.github.io/content/english/blog';
const TARGET_PUBLIC_DIR = '/Users/simo/Downloads/DEV/SITO/public/migrated';
const OUTPUT_DATA_DIR = '/Users/simo/Downloads/DEV/SITO/src/data';

async function migrate() {
    console.log('Starting migration...');

    // Ensure target directories exist
    await fs.ensureDir(TARGET_PUBLIC_DIR);
    await fs.ensureDir(OUTPUT_DATA_DIR);

    const files = await glob(`${SOURCE_DIR}/**/*.md`);
    console.log(`Found ${files.length} markdown files.`);

    const nodes: any[] = [];
    const contents: any = {};
    const links: any[] = [];

    // Hub nodes (categories)
    const categories = new Set<string>();

    for (const file of files) {
        if (file.endsWith('_index.md')) continue; // Skip section indices for now

        const rawContent = await fs.readFile(file, 'utf-8');
        const { data, content } = matter(rawContent);

        if (data.draft) continue; // Skip drafts? Maybe keep them but mark as draft. Let's skip for now.

        // Determine category from path
        // e.g. .../blog/passions/car/index.md -> category = passions
        const relativePath = path.relative(SOURCE_DIR, file);
        const parts = relativePath.split('/');
        const category = parts[0]; // 'passions', 'books', etc.

        categories.add(category);

        const slug = data.slug || parts[parts.length - 2] || path.basename(file, '.md');
        const id = `${category}-${slug}`.toLowerCase().replace(/\s+/g, '-');

        // Handle Image
        let imageUrl = '';
        if (data.image) {
            const imageSourcePath = path.join(path.dirname(file), data.image);
            if (await fs.pathExists(imageSourcePath)) {
                const imageExt = path.extname(data.image);
                const imageTargetName = `${id}${imageExt}`;
                await fs.copy(imageSourcePath, path.join(TARGET_PUBLIC_DIR, imageTargetName));
                imageUrl = `/migrated/${imageTargetName}`;
            }
        }

        // Create Node
        nodes.push({
            id,
            name: data.title || slug,
            type: mapCategoryToType(category),
            val: 10,
            desc: data.description || content.slice(0, 100).replace(/[#*`]/g, '') + '...',
            img: imageUrl,
            link: id // Internal link
        });

        // Create Content
        contents[id] = {
            id,
            title: data.title || slug,
            content: cleanContent(content),
            date: data.date,
            tags: data.tags || [category]
        };

        // Link to Category Hub
        links.push({
            source: `cat-${category}`,
            target: id
        });
    }

    // Create Hub Nodes
    categories.forEach(cat => {
        nodes.push({
            id: `cat-${cat}`,
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            type: mapCategoryToType(cat),
            val: 20,
            desc: `Collection of ${cat}`
        });

        // Link Hub to Me
        links.push({
            source: 'me',
            target: `cat-${cat}`
        });
    });

    // Add "Me" node if not exists (it won't be in the loop)
    nodes.push({
        id: 'me',
        name: 'Simone Mattioli',
        type: 'me',
        val: 30,
        desc: 'Computer Science Student, AI Enthusiast, Volunteer.'
    });

    const graphData = { nodes, links };

    await fs.writeJson(path.join(OUTPUT_DATA_DIR, 'migratedGraphData.json'), graphData, { spaces: 2 });
    await fs.writeJson(path.join(OUTPUT_DATA_DIR, 'migratedContent.json'), contents, { spaces: 2 });

    console.log(`Migration complete! Generated ${nodes.length} nodes and ${links.length} links.`);
}

function mapCategoryToType(cat: string): string {
    const map: any = {
        'passions': 'passion',
        'books': 'book',
        'project': 'project',
        'tech-project': 'tech-project',
        'thought': 'thought',
        'experience': 'experience',
        'publication': 'publication'
    };
    return map[cat] || 'thought';
}

function cleanContent(content: string): string {
    // Remove Hugo shortcodes or replace them
    return content
        .replace(/{{< youtube (.*?) >}}/g, '\n\n[Watch Video on YouTube](https://www.youtube.com/watch?v=$1)\n\n')
        .replace(/{{< .*? >}}/g, ''); // Remove other shortcodes
}

migrate().catch(console.error);
