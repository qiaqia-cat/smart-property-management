const User = require('../models/User');
const RepairOrder = require('../models/RepairOrder');
const Complaint = require('../models/Complaint');
const PropertyFee = require('../models/PropertyFee');

class DashboardService {
  async getOverview() {
    const userCount = await User.count({ where: { role: 0 } });
    const pendingOrders = await RepairOrder.count({ where: { status: 0 } });
    const pendingComplaints = await Complaint.count({ where: { status: 0 } });
    const pendingFees = await PropertyFee.count({ where: { status: 0 } });

    return {
      userCount,
      pendingOrders,
      pendingComplaints,
      pendingFees,
    };
  }

  async getWorkerRanking() {
    const workers = await User.findAll({
      where: { role: 2 },
      attributes: ['id', 'name', 'skill', 'completed_orders', 'avg_rating'],
    });

    const rankings = workers.map((worker) => {
      const score = (worker.completed_orders * 0.6 + worker.avg_rating * 0.4).toFixed(1);
      return {
        id: worker.id,
        name: worker.name,
        skill: worker.skill,
        completed_orders: worker.completed_orders,
        avg_rating: worker.avg_rating,
        score: parseFloat(score),
      };
    });

    rankings.sort((a, b) => b.score - a.score);

    return rankings.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
  }

  async getWorkerStats(workerId) {
    // status: 0=待分派 1=已分派(待接单) 2=进行中 3=已完成
    const pending = await RepairOrder.count({ where: { worker_id: workerId, status: 1 } });
    const processing = await RepairOrder.count({ where: { worker_id: workerId, status: 2 } });
    const completed = await RepairOrder.count({ where: { worker_id: workerId, status: 3 } });
    const total = await RepairOrder.count({ where: { worker_id: workerId } });

    return {
      pending,
      processing,
      completed,
      total,
    };
  }
}

module.exports = new DashboardService();
