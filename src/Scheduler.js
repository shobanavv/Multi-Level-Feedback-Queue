const Queue = require('./Queue'); 
const { 
    QueueType,
    PRIORITY_LEVELS,
} = require('./constants/index');

// A class representing the scheduler
// It holds a single blocking queue for blocking processes and three running queues 
// for non-blocking processes
class Scheduler { 
    constructor() { 
        this.clock = Date.now();
        this.blockingQueue = new Queue(this, 50, 0, QueueType.BLOCKING_QUEUE);
        this.runningQueues = [];
        // Initialize all the CPU running queues
        for (let i = 0; i < PRIORITY_LEVELS; i++) {
            this.runningQueues[i] = new Queue(this, 10 + i * 20, i, QueueType.CPU_QUEUE);
        }
    }

    // Executes the scheduler in an infinite loop as long as there are processes in any of the queues
    // Calculate the time slice for the next iteration of the scheduler by subtracting the current
    // time from the clock property. Don't forget to update the clock property afterwards.
    
    run() {
        while(!this.allQueuesEmpty) {
            let scheduledTime = Date.now();
            const allotTime = scheduledTime - this.clock;
            this.clock = scheduledTime;
            // On every iteration of the scheduler, if the blocking queue is not empty, blocking work
            // should be done. Once the blocking work has been done, perform some CPU work in the same iteration.
            for (let i = 0; i < PRIORITY_LEVELS; i++) {
                const queue = this.runningQueues[i];
                if(this.blockingQueue === null) {
                    queue.CPU_QUEUE(allotTime);
                }
            }
        }
        
    }

    allQueuesEmpty() {
        if(this.blockingQueue === null && this.runningQueues === null) {
            return true;
        } else return false;
    }

    addNewProcess(process) {
        this.blockingQueue[0].enqueue(process);
    }

    // The scheduler's interrupt handler that receives a queue, a process, and an interrupt string constant
    // Should handle PROCESS_BLOCKED, PROCESS_READY, and LOWER_PRIORITY interrupts.
    handleInterrupt(queue, process, interrupt) {

    }

    // Private function used for testing; DO NOT MODIFY
    _getCPUQueue(priorityLevel) {
        return this.runningQueues[priorityLevel];
    }

    // Private function used for testing; DO NOT MODIFY
    _getBlockingQueue() {
        return this.blockingQueue;
    }
}

module.exports = Scheduler;
