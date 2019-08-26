const test = require('tape')
const tcp = require('./')

test('decode packet', t => {
  t.plan(20)

  const packetBuf = Buffer.from('c3560050ee7d2560b5e66669801801c90a5900000101080a000276e95dd3f7a668656c6c6f0a', 'hex')
  const packet = tcp.decode(packetBuf)

  t.equals(packet.sourcePort, 50006)
  t.equals(packet.destinationPort, 80)
  t.equals(packet.sequenceNumber, 4001178976)
  t.equals(packet.acknowledgmentNumber, 3051775593)
  t.equals(packet.dataOffset, 8)
  t.equals(packet.flags, 0x018)
  t.false(packet.reserved)
  t.false(packet.ns)
  t.false(packet.cwr)
  t.false(packet.ece)
  t.false(packet.urg)
  t.true(packet.ack)
  t.true(packet.psh)
  t.false(packet.rst)
  t.false(packet.syn)
  t.false(packet.fin)
  t.equals(packet.windowSize, 457)
  t.equals(packet.checksum, 0x0a59)
  t.equals(packet.urgentPointer, 0)
  t.equals(packet.data.toString(), 'hello\n')
})

test('encode and decode packet', t => {
  t.plan(5)

  const packetDetails = {
    data: Buffer.from('hello\n'),
    sourcePort: 12345,
    destinationPort: 80,
    sequenceNumber: 1234567,
    acknowledgmentNumber: 7654321
  }
  const packetBuf = tcp.encode(packetDetails)
  const packet = tcp.decode(packetBuf)

  t.equals(packet.data.toString(), packetDetails.data.toString())
  t.equals(packet.sourcePort, packetDetails.sourcePort)
  t.equals(packet.destinationPort, packetDetails.destinationPort)
  t.equals(packet.sequenceNumber, packetDetails.sequenceNumber)
  t.equals(packet.acknowledgmentNumber, packetDetails.acknowledgmentNumber)
})
