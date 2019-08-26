exports.encode = encode
exports.decode = decode

function encode ({ data, sourcePort, destinationPort, sequenceNumber = 0, acknowledgmentNumber = 0 }) {
  const packet = Buffer.alloc(20 + data.length)
  packet.writeUInt16BE(sourcePort, 0)
  packet.writeUInt16BE(destinationPort, 2)
  packet.writeUInt32BE(sequenceNumber, 4)
  packet.writeUInt32BE(acknowledgmentNumber, 8)
  packet.writeUInt16BE(0x5000, 12)
  data.copy(packet, 20)
  return packet
}

function decode (buffer) {
  const sourcePort = buffer.readUInt16BE(0)
  const destinationPort = buffer.readUInt16BE(2)
  const sequenceNumber = buffer.readUInt32BE(4)
  const acknowledgmentNumber = buffer.readUInt32BE(8)
  const dataOffset = buffer[12] >> 4 & 15
  const reserved = buffer[12] >> 1 & 7
  const flags = buffer.readUInt16BE(12) & 0b111111111
  const ns = flags >> 8 & 1
  const cwr = flags >> 7 & 1
  const ece = flags >> 6 & 1
  const urg = flags >> 5 & 1
  const ack = flags >> 4 & 1
  const psh = flags >> 3 & 1
  const rst = flags >> 2 & 1
  const syn = flags >> 1 & 1
  const fin = flags & 1
  const windowSize = buffer.readUInt16BE(14)
  const checksum = buffer.readUInt16BE(16)
  const urgentPointer = buffer.readUInt16BE(18)
  const dataOffsetAsBytes = dataOffset * 4
  const data = buffer.slice(dataOffsetAsBytes, buffer.length)

  return {
    sourcePort, destinationPort, sequenceNumber, acknowledgmentNumber, dataOffset,
    flags, reserved, ns, cwr, ece, urg, ack, psh, rst, syn, fin,
    windowSize, checksum, urgentPointer, data
  }
}
