
-- Fix: Replace overly permissive INSERT policy on notifications with a proper one
DROP POLICY "System can insert notifications" ON public.notifications;

-- Allow authenticated users to insert notifications (for booking flow)
CREATE POLICY "Authenticated can insert notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);
