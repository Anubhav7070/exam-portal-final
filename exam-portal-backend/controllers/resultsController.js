const supabase = require('../db/supabaseClient');

exports.getUserResults = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // Fetch results for the user
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
}; 