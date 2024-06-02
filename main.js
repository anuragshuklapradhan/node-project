const fs = require('fs');
const inquirer = require('inquirer');

const filePath = 'todo.json';


const loadTasks = () => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
};


const saveTasks = (tasks) => {
    const dataJSON = JSON.stringify(tasks);
    fs.writeFileSync(filePath, dataJSON);
};


const addTask = async () => {
    const { task } = await inquirer.prompt({
        type: 'input',
        name: 'task',
        message: 'Enter the task:'
    });

    const tasks = loadTasks();
    tasks.push({ task, done: false });
    saveTasks(tasks);

    console.log(`Added task: ${task}`);
};


const listTasks = () => {
    const tasks = loadTasks();
    tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.task} - ${task.done ? 'Done' : 'Pending'}`);
    });
};


const deleteTask = async () => {
    const tasks = loadTasks();

    const { index } = await inquirer.prompt({
        type: 'number',
        name: 'index',
        message: 'Enter the task number to delete:'
    });

    if (index > 0 && index <= tasks.length) {
        const removed = tasks.splice(index - 1, 1);
        saveTasks(tasks);
        console.log(`Deleted task: ${removed[0].task}`);
    } else {
        console.log('Invalid task number');
    }
};


const main = async () => {
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'Choose an action:',
        choices: ['Add Task', 'List Tasks', 'Delete Task', 'Exit']
    });

    switch (action) {
        case 'Add Task':
            await addTask();
            break;
        case 'List Tasks':
            listTasks();
            break;
        case 'Delete Task':
            await deleteTask();
            break;
        case 'Exit':
            console.log('Goodbye!');
            return;
    }

    main();
};

main();
