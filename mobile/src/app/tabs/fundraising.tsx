import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Pressable, TextInput } from 'react-native';

import { supabase } from '@/lib/supabase';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Donation = {
  don_id: string;
  user_id: string;
  amount: number;
  donor: string;
  date: string;
  reason: string;
  thankYou: boolean;
  forThePot: boolean;
  ems: boolean;
  currentlyHave: boolean;
  note: string | null;
};

export default function FundraisingScreen() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddDonation, setShowAddDonation] = useState(false);

  const [amount, setAmount] = useState('');
  const [donor, setDonor] = useState('');
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [thankYouSent, setThankYouSent] = useState(false);
  const [forPot, setForPot] = useState(false);
  const [ems, setEms] = useState(false);
  const [futurePrediction, setFuturePrediction] = useState(false);
  const [note, setNote] = useState('');

  async function loadDonations() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    console.log('Logged in user ID:', user.id);

    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    console.log('Donations:', data);
    console.log(
      'Donation IDs:',
      data?.map((donation) => donation.don_id)
    );
    console.log('Donation error:', error);

    if (error) {
      console.error('Error loading donations:', error);
      setLoading(false);
      return;
    }

    setDonations(data ?? []);
    setLoading(false);
  }

  async function saveDonation() {
    // Get the currently logged-in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('No user is logged in');
      return;
    }

    // Send the donation to Supabase
    const { error } = await supabase
      .from('donations')
      .insert({
        user_id: user.id,
        amount: Number(amount),
        donor: donor,
        date: date,
        reason: reason,
        thankYou: thankYouSent,
        forThePot: forPot,
        ems: ems,
        currentlyHave: futurePrediction,
        note: note,
      });

    if (error) {
      console.error('Error saving donation:', error);
      return;
    }

    // Reload donations so the new one appears
    await loadDonations();

    // Close the form
    setShowAddDonation(false);

    // Clear the form
    setAmount('');
    setDonor('');
    setDate('');
    setReason('');
    setThankYouSent(false);
    setForPot(false);
    setEms(false);
    setFuturePrediction(false);
    setNote('');
  }

  useEffect(() => {
    loadDonations();
  }, []);

  let donationRows: React.ReactNode;

  if (loading) {
    donationRows = (
      <View style={styles.tableRow}>
        <ThemedText>Loading donations...</ThemedText>
      </View>
    );
  } else if (donations.length === 0) {
    donationRows = (
      <View style={styles.tableRow}>
        <ThemedText>No donations yet.</ThemedText>
      </View>
    );
  } else {
    donationRows = (
      <>
        {donations.map((donation) => (
          <View
            key={`donation-${donation.don_id}`}
            style={styles.tableRow}
          >
            <ThemedText style={styles.dateColumn}>
              {donation.date}
            </ThemedText>

            <ThemedText style={styles.donorColumn}>
              {donation.donor}
            </ThemedText>

            <ThemedText style={styles.reasonColumn}>
              {donation.reason}
            </ThemedText>

            <ThemedText style={styles.amountColumn}>
              ${Number(donation.amount).toFixed(2)}
            </ThemedText>
          </View>
        ))}
      </>
    );
  }

  const totalRaised = donations.reduce(
    (sum, d) => sum + Number(d?.amount ?? 0),
    0
  );

  const totalLeft = 16900 - totalRaised;

  const percentageRaised = (totalRaised / 16900) * 100;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <ThemedText type="title" style={styles.title}>
          Fundraising
        </ThemedText>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <ThemedText type="subtitle">
              {`$${totalRaised.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} raised`}
            </ThemedText>

            <ThemedText>
              Goal: $16,900
            </ThemedText>
          </View>

          <View style={styles.progressBackground}>
            <View style={[styles.progressFill, 
              { width: `${percentageRaised}%` }]} />
          </View>

          <ThemedText style={styles.progressText}>
            {`${Math.round(percentageRaised)}% of your goal`}
          </ThemedText>
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <ThemedText style={styles.summaryLabel}>
              Raised
            </ThemedText>

            <ThemedText type="subtitle">
              {`$${totalRaised.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
            </ThemedText>
          </View>

          <View style={styles.chartBox}>
            <ThemedText style={styles.summaryLabel}>
              Donation Reasons
            </ThemedText>

            <View style={styles.chartPlaceholder}>
              <ThemedText>
                Pie Chart
              </ThemedText>
            </View>
          </View>

          <View style={styles.summaryBox}>
            <ThemedText style={styles.summaryLabel}>
              Remaining
            </ThemedText>

            <ThemedText type="subtitle">
              {`$${totalLeft.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
            </ThemedText>
          </View>
        </View>

        {/* Donations */}
        <View style={styles.donationsHeader}>
          <ThemedText type="subtitle">
            Donations
          </ThemedText>

          <Pressable 
          style={styles.addButton}
          onPress={() => setShowAddDonation(true)}
          >
            <ThemedText style={styles.addButtonText}>
              + Add Donation
            </ThemedText>
          </Pressable>
        </View>

        {showAddDonation && (
          <View style={styles.addDonationForm}>
            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              style={styles.input}
              keyboardType="decimal-pad"
            />
            <TextInput
              placeholder="Donor"
              value={donor}
              onChangeText={setDonor}
              style={styles.input}
            />
            <TextInput
              placeholder="Date"
              value={date}
              onChangeText={setDate}
              style={styles.input}
            />
            <TextInput
              placeholder="Reason"
              value={reason}
              onChangeText={setReason}
              style={styles.input}
            />
            <TextInput
              placeholder="Note"
              value={note}
              onChangeText={setNote}
              style={styles.input}
              multiline
            />
            <Pressable
            style={styles.saveButton}
            onPress={saveDonation}>
              <ThemedText style={styles.saveButtonText}>
                Save Donation
              </ThemedText>
            </Pressable>
            <Pressable 
            style={styles.cancelButton}
            onPress={() => setShowAddDonation(false)}>
              <ThemedText>
                Cancel Donation
              </ThemedText>
            </Pressable>
          </View>
        )}

        {/* Search / Filter */}
        <View style={styles.filterRow}>
          <View style={styles.searchBox}>
            <ThemedText style={styles.placeholderText}>
              🔍 Search donations...
            </ThemedText>
          </View>

          <Pressable style={styles.filterButton}>
            <ThemedText>
              Filter
            </ThemedText>
          </Pressable>
        </View>

        {/* Donation Table */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.table}>
            {/* Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <ThemedText style={styles.dateColumn}>
                Date
              </ThemedText>

              <ThemedText style={styles.donorColumn}>
                Donor
              </ThemedText>

              <ThemedText style={styles.reasonColumn}>
                Reason
              </ThemedText>

              <ThemedText style={styles.amountColumn}>
                Amount
              </ThemedText>
            </View>

            <View>
              {donationRows}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },

  title: {
    marginBottom: 24,
  },

  progressSection: {
    marginBottom: 28,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  progressBackground: {
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 7,
  },

  progressText: {
    marginTop: 6,
    textAlign: 'right',
    opacity: 0.7,
  },

  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },

  summaryBox: {
    flex: 1,
    alignItems: 'center',
  },

  summaryLabel: {
    marginBottom: 6,
    opacity: 0.7,
    textAlign: 'center',
  },

  chartBox: {
    flex: 1.3,
    alignItems: 'center',
  },

  chartPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 15,
    borderColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  donationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },

  searchBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  placeholderText: {
    opacity: 0.5,
  },

  filterButton: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  table: {
    minWidth: 600,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    overflow: 'hidden',
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingHorizontal: 12,
  },

  tableHeader: {
    minHeight: 44,
  },

  dateColumn: {
    width: 90,
  },

  donorColumn: {
    width: 140,
  },

  reasonColumn: {
    width: 180,
  },

  amountColumn: {
    width: 100,
    textAlign: 'right',
  },

  addDonationForm: {
  borderWidth: 1,
  borderColor: '#DDD',
  borderRadius: 10,
  padding: 16,
  marginBottom: 20,
},

input: {
  borderWidth: 1,
  borderColor: '#CCC',
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 10,
  marginTop: 12,
},

formButtons: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 16,
},

cancelButton: {
  borderWidth: 1,
  borderColor: '#CCC',
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 10,
},

saveButton: {
  backgroundColor: '#4F46E5',
  borderRadius: 8,
  paddingHorizontal: 16,
  paddingVertical: 10,
},

saveButtonText: {
  color: '#FFFFFF',
  fontWeight: '600',
},
});