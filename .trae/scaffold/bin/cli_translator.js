const fs = require('fs');
const path = require('path');

function loadPlan(planPath) {
    const absPath = path.resolve(process.cwd(), planPath);
    if (!fs.existsSync(absPath)) {
        console.error(`❌ Plan file not found: ${absPath}`);
        process.exit(1);
    }
    try {
        const raw = fs.readFileSync(absPath, 'utf8');
        const plan = JSON.parse(raw);
        if (!plan.type) {
            console.error('❌ Plan.type is required');
            process.exit(1);
        }
        return plan;
    } catch (e) {
        console.error(`❌ Failed to read or parse plan: ${e.message}`);
        process.exit(1);
    }
}

function baseStep(stepId, name) {
    return {
        step_id: stepId,
        name,
        cmd: '',
        args: [],
        cwd: '${PROJECT_ROOT}',
        expects: 'exit_code_0',
        timeout_ms: 10000,
        cache_key: ''
    };
}

function buildCacheKey(obj) {
    const raw = JSON.stringify(obj);
    let hash = 0;
    for (let i = 0; i < raw.length; i += 1) {
        const chr = raw.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return `step_${Math.abs(hash)}`;
}

function requireString(value, name) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        console.error(`❌ ${name} is required`);
        process.exit(1);
    }
    return value.trim();
}

function translatePlan(plan) {
    const steps = [];
    const type = plan.type;
    const sourcePath = typeof plan.source_path === 'string' ? plan.source_path : '';
    const projectName = typeof plan.project_name === 'string' ? plan.project_name : '';

    if (type === 'plan') {
        const s1 = baseStep('step_01', 'Inspect Project State');
        s1.cmd = 'node';
        s1.args = ['.trae/scaffold/bin/context_loader.js'];
        s1.expects = 'text';
        s1.cache_key = buildCacheKey({ type, phase: 'context' });
        steps.push(s1);
    } else if (type === 'prd') {
        const relSourcePath = requireString(sourcePath, 'Plan.source_path (e.g. Source/UPower_Team_v3.1)');

        const s1 = baseStep('step_01', 'Generate PRD Prompt Pack');
        s1.cmd = 'node';
        s1.args = ['.trae/scaffold/bin/ask_ai.js', 'prd', relSourcePath];
        s1.expects = 'exit_code_0';
        s1.cache_key = buildCacheKey({ type, phase: 'ask_ai_prd', source_path: relSourcePath });
        steps.push(s1);
    } else if (type === 'design') {
        const relSourcePath = requireString(sourcePath, 'Plan.source_path (e.g. Source/UPower_Team_v3.1)');

        const s1 = baseStep('step_01', 'Generate DNA Prompt Pack');
        s1.cmd = 'node';
        s1.args = ['.trae/scaffold/bin/ask_ai.js', 'dna', relSourcePath];
        s1.expects = 'exit_code_0';
        s1.cache_key = buildCacheKey({ type, phase: 'ask_ai_dna', source_path: relSourcePath });
        steps.push(s1);
    } else if (type === 'build') {
        const relProjectName = requireString(projectName, 'Plan.project_name (e.g. My_Demo_Project)');

        const s1 = baseStep('step_01', 'Scaffold Project');
        s1.cmd = 'node';
        s1.args = ['.trae/scaffold/bin/scaffold_project.js', relProjectName];
        s1.expects = 'exit_code_0';
        s1.timeout_ms = 300000;
        s1.cache_key = buildCacheKey({ type, phase: 'scaffold_project', project_name: relProjectName });
        steps.push(s1);
    } else if (type === 'audit') {
        const relProjectName = requireString(projectName, 'Plan.project_name (e.g. My_Demo_Project)');

        const s1 = baseStep('step_01', 'Self Check Delivery');
        s1.cmd = 'node';
        s1.args = ['.trae/scaffold/bin/validate_delivery.js', `projects/${relProjectName}`];
        s1.expects = 'exit_code_0';
        s1.timeout_ms = 300000;
        s1.cache_key = buildCacheKey({ type, phase: 'audit', project_name: relProjectName });
        steps.push(s1);
    } else {
        console.error(`❌ Unsupported Plan.type: ${type}`);
        process.exit(1);
    }

    return steps;
}

function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error('Usage: node cli_translator.js <plan_json_path> [output_steps_path]');
        console.error('Plan.type supported: plan, prd, design, build, audit');
        process.exit(1);
    }

    const planPath = args[0];
    const outputPath = args[1] ? path.resolve(process.cwd(), args[1]) : null;

    const plan = loadPlan(planPath);
    const steps = translatePlan(plan);

    const json = JSON.stringify(steps, null, 2);

    if (outputPath) {
        try {
            fs.writeFileSync(outputPath, json, 'utf8');
            console.log(`✅ Steps written to ${outputPath}`);
        } catch (e) {
            console.error(`❌ Failed to write steps: ${e.message}`);
            process.exit(1);
        }
    } else {
        console.log(json);
    }
}

main();
