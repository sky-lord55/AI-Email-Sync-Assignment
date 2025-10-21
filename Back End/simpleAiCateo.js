function categorizeEmail(email) {
  const text = (email.subject + ' ' + email.text).toLowerCase();
  if (text.includes('thank you for shortlisting') || text.includes('interview')) return 'Interested'
  if (text.includes('meet') || text.includes('schedule')) return 'Meeting Booked'
  if (text.includes('not interested') || text.includes('reject')) return 'Not Interested'
  if (text.includes('spam') || text.includes('advertisement')) return 'Spam'
  if (text.includes('out of office') || text.includes('vacation')) return 'Out of Office'
  return 'Uncategorized'
}
